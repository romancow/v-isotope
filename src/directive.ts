import type { DirectiveOptions, DirectiveBinding } from 'vue/types/options'
import Masonry from 'masonry-layout'
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

export { Options }

namespace Instance {
	export function create(el: HTMLElement, binding: DirectiveBinding) {
		const masonry = new Masonry(el, Options.get(binding))
		const { created, destroyed, ...on }: Options.On = binding.value?.on ?? {}
		if (on)
			forEach(on, (listener, event) => masonry.on(event, listener))
		created?.(masonry)
	}
	
	export function destroy(el: HTMLElement, { value }: DirectiveBinding) {
		const masonry = Masonry.data(el)
		masonry?.allOff()
		masonry?.destroy()
		value?.on?.destroyed?.(masonry)
	}
	
	export function refresh(el: HTMLElement, binding: DirectiveBinding) {
		const masonry = Masonry.data(el)
		if (masonry) {
			masonry.options = Options.get(binding)
			masonry.layout()
		}
		return (masonry != null)
	}
}

const directive: DirectiveOptions = {
	inserted(el, binding) {
		if (binding.value !== false)
			Instance.create(el, binding)
	},

	componentUpdated(el, binding) {
		if (binding.value === false)
			Instance.destroy(el, binding)
		else if (!Instance.refresh(el, binding))
			Instance.create(el, binding)
	},

	unbind: Instance.destroy
}

export default directive
