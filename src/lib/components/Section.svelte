<script>
    import AgeFab from "$lib/components/AgeFab.svelte";

    export let fab = "";
    export let container = false;
</script>

<div class="section-head">
    {#if fab !== ""}
        <AgeFab name={fab} />
        <div class="content">
            <slot name="section-head" />
        </div>
    {:else}
        <slot name="section-head" />
    {/if}
</div>

<div class="section-body" class:raw-content={container}>
    <slot name="section-body" />
</div>

<style>
    * :global(.mdc-fab) {
        float: left;
    }

    .section-head {
        padding: 40px 15px;
        color: whitesmoke;
        background-color: rgba(0, 0, 0, 0.68);
    }

    .section-head .content {
        margin-left: 90px;
    }

    .section-body {
        margin-bottom: 0.6em;
    }

    div.raw-content {
        padding: 10px;
    }
</style>
