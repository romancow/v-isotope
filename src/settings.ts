import type { default as Vue } from 'vue'
import type Masonry from 'masonry-layout'

function mapValues<T, R>(obj: T, mapFn: <K extends keyof T>(val: T[K], key: K, obj: T) => R) {
	const keys = Object.keys(obj) as (keyof T)[]
	return keys.reduce((mapped, key) => {
		mapped[key] = mapFn(obj[key], key, obj)
		return mapped
	}, {} as { [k in keyof T]: R })
}

export namespace Options {
	type PropKey = keyof typeof Props

	const Defaults: { [key: string]: any } = {
		itemSelector: ".v-masonry-item",
		stamp: ".v-masonry-stamp"
	}

	export const Props = mapValues({

		// Recommended
		itemSelector: String,
		columnWidth: [Number, String],

		// Layout
		gutter: [Number, String],
		horizontalOrder: Boolean,
		percentPosition: Boolean,
		stamp: String,
		fitWidth: Boolean,
		originLeft: Boolean,
		originTop: Boolean,
		hiddenStyle: Object,
		visibleStyle: Object,

		// Setup
		containerStyle: Object,
		transitionDuration: String,
		stagger: [Number, String],
		resize: Boolean,
		initLayout: Boolean
	}, (type, name) => ({ type, default: Defaults[name] ?? null }))

	export function select(src: { [key: string]: any }) {
		const keys = Object.keys(Props) as PropKey[]
		return keys.reduce(<K extends PropKey>(options: Masonry.Options, key: K) => {
			const value = src[key]
			if (value != null)
				options[key] = value
			return options
		}, {} as Masonry.Options)
	}
}

export namespace Methods {
	export const Names = [

		// Layout
		"layout",
		"layoutItems",
		"stamp",
		"unstamp",

		// Adding & removing items
		"appended",
		"prepended",
		"addItems",
		"remove",
		
		// Utilities
		"reloadItems",
		"destroy",
		"getItemElements"
	] as const

	export function map() {
		return Names.reduce((methods, name) => {
			methods[name] = function(this: any, ...args) { return this.instance?.[name](...args) }
			return methods
		}, {} as { [mth in typeof Names[number]]: (...args: any[]) => any })
	}
}

type Event = typeof Event.All[number]

namespace Event {
	export const All = [
		"layoutComplete",
		"removeComplete"
	] as const

	export function method(event: string) {
		return function(this: Vue, ...args: any[]) {
			this.$emit(event, ...args)
		}
	}
}

export { Event }
