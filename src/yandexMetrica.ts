// Define the `ym` type from Yandex Metrica
declare global {
	interface Window {
		ym: (counterId: number, action: string, eventName: string, params?: Record<string, unknown>) => void;
	}
}

// Track events function
const trackYandexEvent = (
	eventName: string,
	params: Record<string, unknown> = {}
): void => {
	if (typeof window !== "undefined" && typeof window.ym === "function") {
		window.ym(99150938, "reachGoal", eventName, params);
	} else {
		console.warn("Yandex Metrica is not initialized or unavailable.");
	}
};

export default trackYandexEvent;
