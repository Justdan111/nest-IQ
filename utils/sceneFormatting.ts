import type { SceneTrigger } from '@/types';

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** "7:00 am" / "12:30 pm" from a structured trigger. */
export function formatSceneTime(trigger: SceneTrigger): string {
  const h12 = trigger.hour % 12 === 0 ? 12 : trigger.hour % 12;
  const period = trigger.hour < 12 ? 'am' : 'pm';
  return `${h12}:${String(trigger.minute).padStart(2, '0')} ${period}`;
}

/** "Everyday" / "Fri, Sat" / "Once" — the right-hand label on a scene card. */
export function formatSceneRepeat(weekdays: number[]): string {
  if (weekdays.length === 0) return 'Once';
  if (weekdays.length === 7) return 'Everyday';
  return [...weekdays]
    .sort((a, b) => a - b)
    .map((d) => WEEKDAY_LABELS[d])
    .join(', ');
}
