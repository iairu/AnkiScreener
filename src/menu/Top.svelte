<script>
    import { exitApp, NYI, devTools, restartApp } from "../controller";

</script>

<div id="top">
    <button aria-label="Exit the app" on:click={exitApp}>X</button>
    <button aria-label="Choose active folder" on:click={NYI}>Folder</button>
    <button aria-label="Toggle capture mode" on:click={NYI}>F8</button>
    <button aria-label="Hide additional info" on:click={NYI}>/\</button>
    <button aria-label="Launch dev tools" on:click={devTools}>DT</button>
    <button aria-label="Restart the app" on:click={restartApp}>R</button>
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