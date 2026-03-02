import { WebHaptics } from 'web-haptics';

type HapticType = 'light' | 'medium' | 'heavy' | 'success';

let instance: WebHaptics | null = null;

function getInstance() {
	if (!instance && typeof document !== 'undefined') {
		instance = new WebHaptics();
	}
	return instance;
}

export function haptic(type: HapticType = 'light'): void {
	getInstance()?.trigger(type);
}
