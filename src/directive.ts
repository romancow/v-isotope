import type { DirectiveOptions, DirectiveBinding } from 'vue/types/options'
import Vue from 'vue'
import Masonry from 'masonry-layout'
import Options from './options.js'
import { forEach } from './utilities.js'

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
			masonry.options = {
				...Masonry.defaults,
				...Options.get(binding)
			}
			masonry.reloadItems()
			masonry.layout()
		}
		return (masonry != null)
	}
}

const directive: DirectiveOptions = {
	inserted(el, binding) {
		if (binding.value !== false)
			Vue.nextTick(() => Instance.create(el, binding))
	},

	componentUpdated(el, binding) {
		if (binding.value === false)
			Instance.destroy(el, binding)
		else Vue.nextTick(() => {
			if (!Instance.refresh(el, binding))
				Instance.create(el, binding)
		})
	},

	unbind: Instance.destroy
}

export default directive
