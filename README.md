# v-masonry
A Vue component wrapper around the [Masonry cascading grid layout library](https://masonry.desandro.com/).

## Peer Dependenices
- [vue](https://www.npmjs.com/package/vue)

```
npm install vue
```

## Installation

Add a scope mapping for the GitHub npm package manager by adding a `.npmrc` file with the line:
```
@romancow:registry=https://npm.pkg.github.com/
```

Then install the package:
```
npm install @romancow/v-masonry
```
or
```
yarn add @romancow/v-masonry
```

More info on using the GitHub npm package registry [here](https://help.github.com/en/articles/configuring-npm-for-use-with-github-package-registry#installing-a-package).

## Usage

### Basic Example

```javascript
import VMasonry from '@romancow/v-masonry'

new Vue({
	components: { VMasonry },
	el: '#app',
	data: {
		items: ["one", "two", "three", "four"]
	}
})
```

```html
<div id="app">
	<v-masonry :items="items">
		<template #item="{ item }">
			<div>{{ item }}</div>
		<template>

		<template #empty>
			<p>There are no items to show.<p>
		</template>
	</v-flickity>
</div>
```

### Options

All [Masonry Options](https://masonry.desandro.com/options.html) correspond to [Vue component props](https://vuejs.org/v2/guide/components-props.html).

There are also a few "convenience" properties that provide `false` values for existing Masonry options that have a default `true` value:

- `origin-right`: sets `originLeft` to `false`
- `origin-bottom`: sets `originTop` to `false`
- `no-resize`: sets `resize` to `false`

```html
<v-masonry origin-right origin-bottom no-resize>
	...
</v-masonry>
```

### Events

[Masonry events](https://masonry.desandro.com/events.html) are mapped as kebab-cased [Vue component events](https://vuejs.org/v2/guide/events.html).

```html
<v-masonry @layout-complete="eventHandler">
	...
</v-masonry>
```

### Slots

#### items

Used to render the child elements that will be used as item elements in the layout.

#### empty

Rendered in place of `#items` if the component's `items` property is empty.

#### stamp

Elements in this slot are elements that will be ["stamped"](https://masonry.desandro.com/options.html#stamp) within the layout.

#### prepend

Static elements that will be rendered before `#items`, `#empty`, or `#stamp`.

#### append

Static elements that will be rendered after `#items`, `#empty`, or `#stamp`.

#### default

If a deafult slot is specified, it's contents will override all other slots as the contents within the Masonry instance's root node, allowing you to comletely customize its contents. You can use the default item selector class `v-masonry-item` and the default stamp class `v-masonry-stamp`, or specify your own with the [`itemSelector`](https://masonry.desandro.com/options.html#itemselector) and [`stamp`](https://masonry.desandro.com/options.html#stamp) options.
