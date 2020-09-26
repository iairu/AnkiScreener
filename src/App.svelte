<script>

</script>

<menu>
	<div class="always">
		<button name="close" aria-label="Close">X</button>
		<button name="activeFolder" aria-label="Active Folder">Folder</button>
		<button name="toggleCaptureKey" aria-label="Toggle Capture Key">F8</button>
		<button name="hideCapturing" aria-label="Hide additional info">/\</button>
	</div>
	<div class="capturing">
		<div class="groups">
			<div class="group" id="group_1">
				<label for="groupAfixes">GroupName (1)</label>
				<button class="toggleGroupSettings">/\</button>
				<div class="settings">
					<input type="text" name="groupAfixes" id="group_1_afixes" placeholder="Prefix #IMG# Suffix">
				</div>
			</div>
		</div>
		<div class="keybindToggles">
			<div class="toggle" id="toggle_append">
				<label for="toggle_state"><b>A</b>ppend to</label>
				<input type="checkbox" name="toggle_state" id="toggle_append_state">
				<div class="details">somethingsomething.csv</div>
			</div>
		</div>
		<div class="keybinds">
			<div class="keybind" id="keybind_addSelection">
				<img src="" alt="Keybind Icon" class="icon">
				<label for="keybind">Add selection</label>
			</div>
		</div>
	</div>
</menu>

<style>
	menu {
		display: inline-block;
		padding: 0;
		margin: 0;
		border: 1px solid black;
		border-radius: 15px;
	}
</style>