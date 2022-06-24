<script>
    import moment from "moment-timezone";
    import Section from "$lib/components/Section.svelte";
    import Accordion, { Panel, Header, Content } from "@smui-extra/accordion";
    import IconButton, { Icon } from "@smui/icon-button";

    import { news } from "$lib/stores";

    export let _news;

    let isOpen = [];

    news.set(...[_news]);

    let time = (dateTime) => moment(dateTime).tz("Europe/London").format("dddd, HH:mm");
</script>

<Section fab="icon:feed" container={true}>
    <div slot="section-head">
        <h4>News</h4>
        Updates and announcements made during the tournament
    </div>

    <div slot="section-body">
        <div class="accordion-container">
            <Accordion>
                {#each $news as { title, created, body }, i}
                    <Panel bind:open={isOpen[i]}>
                        <Header>
                            <h6>{title}</h6>
                            <small>{time(created)}</small>
                            <IconButton slot="icon" toggle pressed={isOpen[i]}>
                                <Icon class="material-icons" on>expand_less</Icon>
                                <Icon class="material-icons">expand_more</Icon>
                            </IconButton>
                        </Header>
                        <Content>{body}</Content>
                    </Panel>
                {/each}
            </Accordion>
        </div>
    </div>
</Section>
