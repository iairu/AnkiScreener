<script>
    import { notifications } from "../store";

    function onShow(n) {
        setTimeout(n.onFinish, n.ms);
        return true;
    }
</script>

<notifications>
    {#each $notifications as notification}
        <note>
            {#if onShow(notification) && !notification.isImgSrc}
                {notification.text}
            {:else}
                <img src={notification.text} alt="Notification">
            {/if}
        </note>
    {/each}
</notifications>