<script>
	import { isCapturing, isHidden } from './store.js';
	import Top from './menu/Top.svelte';
	import Groups from './menu/Groups.svelte';
	import Tags from './menu/Tags.svelte';
	import Keybinds from './menu/Keybinds.svelte';
</script>

<style lang="scss" global>
	@import "App.scss";
</style>

<menu>
	<Top />
	{#if $isCapturing && !$isHidden}
	<div class="capturing">
		<Groups />
		<Tags />
		<Keybinds />
	</div>
	{/if}
</menu>
