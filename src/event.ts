import type { default as Vue } from 'vue'

type Event = typeof Event.All[number]

namespace Event {
	export const All = [
		"layoutComplete",
		"removeComplete"
	] as const

	export function emitter(event: string) {
		return function(this: Vue, ...args: any[]) {
			this.$emit(event, ...args)
		}
	}
}

export default Event
