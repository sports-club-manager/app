<script>
    import { page } from '$app/stores';
    import Section from "$lib/components/Section.svelte";

    let { error, status } = page;
</script>

<Section fab="icon:error" container={true}>
    <div slot="section-head">
        <h4>Error</h4>
        There was a problem with this request.
    </div>

    <div slot="section-body">
        {#if status == 500}
            <h5>Server error ({status})</h5>
            <p>{error.message}</p>
        {:else if status == 404}
            <h5>Not found ({status})</h5>
            <p>please check any links you clicked, they may be out of date.</p>
        {:else if status == 403}
            <h5>Forbidden ({status})</h5>
            <p>You are not permitted to access that page or resource.</p>
        {:else}
            Not sure what else to tell you :(
        {/if}
    </div>
</Section>
