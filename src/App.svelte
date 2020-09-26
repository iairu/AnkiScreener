<script>
	import Top from './menu/Top.svelte';
	import Groups from './menu/Groups.svelte';
	import KeybindToggles from './menu/KeybindToggles.svelte';
	import Keybinds from './menu/Keybinds.svelte';
</script>

<menu>
	<div class="always">
		<Top />
	</div>
	<div class="capturing">
		<!-- <Groups />
		<KeybindToggles />
		<Keybinds /> -->
	</div>
</menu>

<style lang="scss">
menu {
	display: inline-block;
	padding: 0;
	margin: 15px 0 0 15px;
	border: 1px solid black;
	border-radius: 15px;
	background: rgb(38, 142, 161);
	overflow: hidden;
	:global(button) {
		background: transparent;
		border: 1px solid rgba(0, 0, 0, 0.493);
		box-shadow: inset 0px 0px 0px 1px rgba(255,255,255,0.2);
		border-radius: 5px;
		color: white;
		outline: none;
		cursor: pointer;
		&:hover {background: rgba(255,255,255,0.2);}
		&:active {background: rgba(0,0,0,0.2);}
		&:focus {
			box-shadow: inset 0px 0px 0px 1px rgba(255,255,255,0.5);
		}
	}
}
</style>