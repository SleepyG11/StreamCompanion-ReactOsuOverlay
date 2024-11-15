import DonutProgress from './DonutProgress';

export default function ConicProgress({ color, size = 80, displayLabel }) {
	return <DonutProgress size={size} width={size / 2} color={color} displayLabel={displayLabel} />;
}
