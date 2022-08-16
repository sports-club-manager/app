export const load = async ({ parent }) => {
    const data = await parent();
    return {
        tournament: data.tournament,
    };
};
