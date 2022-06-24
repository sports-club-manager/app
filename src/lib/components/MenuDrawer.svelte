<script>
    import { goto } from "$app/navigation";

    import Drawer, { Content, Header, Title, Subtitle, Scrim } from "@smui/drawer";
    import List, { Item, Text, Graphic, Separator, Subheader, PrimaryText, SecondaryText } from "@smui/list";

    export let tournament,
        pages,
        user,
        open = false;
    let active = "Home";

    function setActive(value, location) {
        active = value;
        open = false;
        if (location) goto(location);
    }
</script>

<Drawer variant="modal" fixed={false} bind:open>
    <Header>
        <Title>
            {tournament.club}
        </Title>
        <Subtitle>{tournament.name}</Subtitle>
    </Header>
    <Content>
        {#if user && user.name}
            <List twoLine avatarList>
                <Item href="javascript:void(0)" on:click={() => goto(`/auth/google/logout`)}>
                    <Graphic><img style="height: 40px;width: 40px" class="mdc-fab" src={user.photo} alt={user.name} /></Graphic>
                    <Text>
                        <PrimaryText>{user.name}</PrimaryText>
                        <SecondaryText>{user.email}</SecondaryText>
                    </Text>
                </Item>
            </List>
        {/if}
        <List>
            {#if !(user && user.name)}
                <Item href="javascript:void(0)" on:click={() => goto(`/auth/google/login`)}>
                    <Graphic class="material-icons" aria-hidden="true">login</Graphic>
                    <Text>Login</Text>
                </Item>
            {:else}
                <Item href="javascript:void(0)" on:click={() => goto(`/auth/logout`)}>
                    <Graphic class="material-icons" aria-hidden="true">logout</Graphic>
                    <Text>Logout</Text>
                </Item>
            {/if}
            <Item href="javascript:void(0)" on:click={() => setActive("Home", "/")} activated={active === "Home"}>
                <Graphic class="material-icons" aria-hidden="true">home</Graphic>
                <Text>Home</Text>
            </Item>
            {#if tournament.siteMap}
                <Item href={tournament.siteMap}>
                    <Graphic class="material-icons" aria-hidden="true">fmd_good</Graphic>
                    <Text>Site Map</Text>
                </Item>
            {/if}
            <Item href="javascript:void(0)" on:click={() => setActive("News", "/news")} activated={active === "News"}>
                <Graphic class="material-icons" aria-hidden="true">feed</Graphic>
                <Text>News</Text>
            </Item>

            <Separator />
            <Subheader>Tournament Information</Subheader>
            {#each pages as page}
                <Item
                    href="javascript:void(0)"
                    on:click={() => setActive(page.title, `/pages/${page.title}`)}
                    activated={active === page.title}
                >
                    <Graphic class="material-icons" aria-hidden="true">bookmark</Graphic>
                    <Text>{page.title}</Text>
                </Item>
            {/each}
        </List>
    </Content>
</Drawer>
<Scrim />
