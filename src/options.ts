import type Masonry from 'masonry-layout'
import type { PropType } from 'vue/types/options'
import { mapValues, invert } from './utilities'

namespace Options {
	type Option = keyof Masonry.Options
	type Source = Masonry.Options & {
		[key in keyof typeof Negated]?: boolean
	}

	const Defaults: { [key: string]: any } = {
		itemSelector: ".v-masonry-item",
		stamp: ".v-masonry-stamp",
		initLayout: false
	}

	const Types: { [opt in Option]: PropType<any> } = {

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
	}

	const Negated = {
		originRight: "originLeft",
		originBottom: "originTop",
		noResize: "resize"
	}

	export function toProps() {
		return {
			...mapValues(Types, (type, name) => ({ type, default: Defaults[name] ?? null })),
			...mapValues(Negated, () => ({ type: Boolean, default: false }))
		}
	}

	export function select(src: Source) {
		return {
			...mapValues(Types, (_, prop) => src[prop] ?? undefined ),
			...mapValues(invert(Negated), prop => (src[prop]  != null) ? !src[prop] : undefined)
		} as Masonry.Options
	}
}

export default Options
