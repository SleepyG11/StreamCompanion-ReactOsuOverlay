import { useEffect } from 'react';
import { useTransitionValue } from 'react-transition-value';

/**
 * @param {number | null} targetValue
 * @returns {number}
 */
export function useTransition(targetValue, options = { from: 0, duration: 500, throttleThreshold: 0.01 }) {
	targetValue = targetValue ?? 0;
	let [value, setValue] = useTransitionValue(options.from ?? 0, {
		duration: options.duration ?? 500,
	});

	useEffect(() => {
		setValue(targetValue ?? NaN);
	}, [targetValue, setValue]);

	if (Math.abs(value - targetValue) < (options.throttleThreshold ?? 0.01)) return targetValue;
	return value;
}
