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
            {onShow(notification) && notification.text}
        </note>
    {/each}
</notifications>