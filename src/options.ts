import type Masonry from 'masonry-layout'
import type { DirectiveBinding } from 'vue/types/options'
import { mapKeys, forEach, camelcase } from './utilities.js'

type Options = Masonry.Options & { on?: Options.On }

namespace Options {
	export const Negated = {
		originRight: "originLeft",
		originBottom: "originTop",
		noResize: "resize"
	}

	export type On = Record<Masonry.Event, Masonry.Listener> & {
		created?: (instance: Masonry) => void,
		destroyed?: (instance: Masonry) => void
	}
	
	type Modifiers = Record<string, boolean>

	export function get({ value = {}, modifiers }: DirectiveBinding): Masonry.Options {
		const modOpts: Modifiers = {}
		forEach(mapKeys<Modifiers>(modifiers, camelcase), (val: boolean, key) => {
			const nKey: string = (<any>Negated)[key]
			modOpts[nKey ?? key] = (!nKey == val)
		})
		const { on = null, ...valOpts } =
			(typeof value === "string") ? { itemSelector: value } :
			(typeof value === "number") ? { columnWidth: value } :
			(value === true) ? {} : value
		return { ...modOpts, ...valOpts }
	}
}

export default Options
