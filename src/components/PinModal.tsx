import React, { useCallback, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Delete, Lock, X } from 'lucide-react';
import { ADMIN_EMAIL, auth, db, PASSCODE_SUFFIX } from '../firebase';

interface PinModalProps {
  open: boolean;
  onClose: () => void;
  onAuthenticated: () => void;
}

const ATTEMPTS_KEY = 'oc_pin_attempts';
const LOCK_UNTIL_KEY = 'oc_pin_lock_until';
const MAX_ATTEMPTS = 5;
const LOCK_DURATION_MS = 5 * 60 * 1000;

export const PinModal: React.FC<PinModalProps> = ({
  open,
  onClose,
  onAuthenticated,
}) => {
  const [checkingSetup, setCheckingSetup] = useState(true);
  const [isSetupMode, setIsSetupMode] = useState(false);
  const [setupStep, setSetupStep] = useState<'first' | 'confirm'>('first');
  const [firstPin, setFirstPin] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [lockedUntil, setLockedUntil] = useState<number>(() => {
    const raw = localStorage.getItem(LOCK_UNTIL_KEY);
    return raw ? Number(raw) : 0;
  });
  const [now, setNow] = useState(() => Date.now());

  // Tick every second while locked
  useEffect(() => {
    if (!open || lockedUntil <= Date.now()) return;
    const id = window.setInterval(() => {
      const t = Date.now();
      setNow(t);
      if (t >= lockedUntil) {
        setLockedUntil(0);
        localStorage.removeItem(LOCK_UNTIL_KEY);
        localStorage.setItem(ATTEMPTS_KEY, '0');
        setError('');
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [open, lockedUntil]);

  // Check first-time setup status when opened
  useEffect(() => {
    if (!open) return;
    setPin('');
    setFirstPin('');
    setSetupStep('first');
    setError('');
    setCheckingSetup(true);

    const savedLock = Number(localStorage.getItem(LOCK_UNTIL_KEY) || 0);
    if (savedLock > Date.now()) {
      setLockedUntil(savedLock);
      setNow(Date.now());
    } else if (savedLock > 0) {
      localStorage.removeItem(LOCK_UNTIL_KEY);
      localStorage.setItem(ATTEMPTS_KEY, '0');
      setLockedUntil(0);
    }

    (async () => {
      try {
        const snap = await getDoc(doc(db, 'config', 'adminMeta'));
        if (snap.exists() && snap.data()?.setupComplete === true) {
          setIsSetupMode(false);
        } else {
          setIsSetupMode(true);
        }
      } catch {
        setIsSetupMode(false);
      } finally {
        setCheckingSetup(false);
      }
    })();
  }, [open]);

  const isLocked = lockedUntil > now;
  const remainingSec = Math.max(0, Math.ceil((lockedUntil - now) / 1000));
  const mm = String(Math.floor(remainingSec / 60)).padStart(2, '0');
  const ss = String(remainingSec % 60).padStart(2, '0');

  const submitPin = useCallback(
    async (enteredPin: string) => {
      if (busy || isLocked || enteredPin.length !== 4) return;

      if (isSetupMode) {
        if (setupStep === 'first') {
          setFirstPin(enteredPin);
          setPin('');
          setSetupStep('confirm');
          setError('');
          return;
        }
        if (enteredPin !== firstPin) {
          setPin('');
          setFirstPin('');
          setSetupStep('first');
          setError('Codes did not match. Try again.');
          return;
        }

        setBusy(true);
        setError('');
        try {
          await createUserWithEmailAndPassword(
            auth,
            ADMIN_EMAIL,
            enteredPin + PASSCODE_SUFFIX
          );
          await setDoc(doc(db, 'config', 'adminMeta'), {
            setupComplete: true,
            updatedAt: Date.now(),
          });
          localStorage.setItem(ATTEMPTS_KEY, '0');
          localStorage.removeItem(LOCK_UNTIL_KEY);
          onAuthenticated();
        } catch (err: unknown) {
          const code = (err as { code?: string })?.code || '';
          if (code === 'auth/email-already-in-use') {
            // Account already exists: switch permanently to standard login pad
            setIsSetupMode(false);
            setSetupStep('first');
            setFirstPin('');
            setPin('');
            setError('Enter your 4-digit code');
          } else if (code === 'auth/operation-not-allowed') {
            setPin('');
            setSetupStep('first');
            setFirstPin('');
            setError(
              'Enable Email/Password sign-in in Firebase Authentication Console.'
            );
          } else {
            setPin('');
            setSetupStep('first');
            setFirstPin('');
            setError('Unable to set code. Please try again.');
          }
        } finally {
          setBusy(false);
        }
        return;
      }

      // Returning login
      setBusy(true);
      setError('');
      try {
        await signInWithEmailAndPassword(
          auth,
          ADMIN_EMAIL,
          enteredPin + PASSCODE_SUFFIX
        );
        // Ensure adminMeta flag exists if account was created externally
        try {
          await setDoc(doc(db, 'config', 'adminMeta'), {
            setupComplete: true,
            updatedAt: Date.now(),
          });
        } catch {
          // ignore secondary write errors
        }
        localStorage.setItem(ATTEMPTS_KEY, '0');
        localStorage.removeItem(LOCK_UNTIL_KEY);
        onAuthenticated();
      } catch (err: unknown) {
        const code = (err as { code?: string })?.code || '';
        setPin('');
        if (code === 'auth/operation-not-allowed') {
          setError(
            'Enable Email/Password sign-in in Firebase Authentication Console.'
          );
        } else {
          const prevAttempts = Number(localStorage.getItem(ATTEMPTS_KEY) || 0) + 1;
          if (prevAttempts >= MAX_ATTEMPTS) {
            const until = Date.now() + LOCK_DURATION_MS;
            localStorage.setItem(ATTEMPTS_KEY, String(prevAttempts));
            localStorage.setItem(LOCK_UNTIL_KEY, String(until));
            setLockedUntil(until);
            setNow(Date.now());
            setError('Too many wrong attempts');
          } else {
            localStorage.setItem(ATTEMPTS_KEY, String(prevAttempts));
            setError('Wrong code');
          }
        }
      } finally {
        setBusy(false);
      }
    },
    [busy, isLocked, isSetupMode, setupStep, firstPin, onAuthenticated]
  );

  const handleDigit = useCallback(
    (digit: string) => {
      if (busy || isLocked || checkingSetup) return;
      if (pin.length >= 4) return;
      const next = pin + digit;
      setPin(next);
      setError('');
      if (next.length === 4) {
        void submitPin(next);
      }
    },
    [busy, isLocked, checkingSetup, pin, submitPin]
  );

  const handleBackspace = useCallback(() => {
    if (busy || isLocked) return;
    setPin((p) => p.slice(0, -1));
  }, [busy, isLocked]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (/^[0-9]$/.test(e.key)) {
        handleDigit(e.key);
      } else if (e.key === 'Backspace') {
        handleBackspace();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose, handleDigit, handleBackspace]);

  if (!open) return null;

  const heading = isSetupMode
    ? setupStep === 'first'
      ? 'Set your 4-digit code'
      : 'Confirm your 4-digit code'
    : 'Enter 4-digit code';

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
      dir="ltr"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xs bg-[#121212] border border-[#C9A13B]/45 p-6 sm:p-7 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 end-3 w-8 h-8 flex items-center justify-center text-[#F5F1E8]/60 hover:text-[#E8D08A]"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-6">
          <div className="w-11 h-11 mx-auto mb-3 flex items-center justify-center border border-[#C9A13B]/40 bg-[#0A0A0A] text-[#E8D08A]">
            <Lock className="w-4 h-4" />
          </div>
          <h2 className="font-display text-2xl font-semibold text-[#F5F1E8]">
            {checkingSetup ? 'Please wait...' : heading}
          </h2>
        </div>

        {/* 4-dot PIN indicator */}
        <div className="flex items-center justify-center gap-4 mb-5">
          {[0, 1, 2, 3].map((i) => {
            const filled = i < pin.length;
            return (
              <div
                key={i}
                className={`w-3.5 h-3.5 rounded-full border transition-all ${
                  filled
                    ? 'bg-[#C9A13B] border-[#E8D08A] scale-110'
                    : 'bg-transparent border-[#C9A13B]/40'
                }`}
              />
            );
          })}
        </div>

        {/* Error or Lockout feedback */}
        <div className="min-h-[24px] text-center mb-4">
          {isLocked ? (
            <p className="text-xs text-[#E8D08A] tabular-nums">
              Locked. Try again in {mm}:{ss}
            </p>
          ) : error ? (
            <p className="text-xs text-[#E8D08A]">{error}</p>
          ) : null}
        </div>

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-2.5">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              disabled={busy || isLocked || checkingSetup}
              onClick={() => handleDigit(digit)}
              className="h-12 bg-[#1A1A1A] border border-[#C9A13B]/25 text-base font-semibold text-[#F5F1E8] hover:border-[#C9A13B] hover:text-[#E8D08A] active:bg-[#C9A13B] active:text-[#0A0A0A] disabled:opacity-35 transition-colors tabular-nums"
            >
              {digit}
            </button>
          ))}
          <div />
          <button
            type="button"
            disabled={busy || isLocked || checkingSetup}
            onClick={() => handleDigit('0')}
            className="h-12 bg-[#1A1A1A] border border-[#C9A13B]/25 text-base font-semibold text-[#F5F1E8] hover:border-[#C9A13B] hover:text-[#E8D08A] active:bg-[#C9A13B] active:text-[#0A0A0A] disabled:opacity-35 transition-colors tabular-nums"
          >
            0
          </button>
          <button
            type="button"
            disabled={busy || isLocked || checkingSetup}
            onClick={handleBackspace}
            className="h-12 bg-[#1A1A1A] border border-[#C9A13B]/25 flex items-center justify-center text-[#F5F1E8]/80 hover:border-[#C9A13B] hover:text-[#E8D08A] disabled:opacity-35 transition-colors"
            aria-label="Backspace"
          >
            <Delete className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
