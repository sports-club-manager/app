<script>
    import { page } from "$app/stores";
    import Section from "$lib/components/Section.svelte";
</script>

<Section fab="icon:error" container={true}>
    <div slot="section-head">
        {#if $page.status == 500}
            <h4>Server error ({$page.status})</h4>
            <p>{$page.error?.message}</p>
        {:else if $page.status == 404}
            <h4>Not found ({$page.status})</h4>
            <p>please check any links you clicked, they may be out of date.</p>
        {:else if $page.status == 403}
            <h4>Forbidden ({$page.status})</h4>
            <p>You are not permitted to access that page or resource.</p>
        {:else}
            <h4>Error</h4>
            Not sure what else to tell you :(
        {/if}
    </div>

    <div slot="section-body" />
</Section>
