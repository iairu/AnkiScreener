<script>
</script>

<div id="top">
    <button name="close" aria-label="Close">X</button>
    <button name="activeFolder" aria-label="Active Folder">Folder</button>
    <button name="toggleCaptureKey" aria-label="Toggle Capture Key">F8</button>
    <button name="hideCapturing" aria-label="Hide additional info">/\</button>
</div>

<style lang="scss">
#top {
    display: flex;
    button {
        margin: 0;
        padding: 5px 7px;
        &:not(:first-of-type) {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
            border-left: none;
        }
        &:not(:last-of-type) {
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
        }
        &:first-of-type {padding-left: 10px;}
        &:last-of-type {padding-right: 10px;}
    }
}
</style>