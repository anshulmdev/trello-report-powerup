export const getCardData = async (t) => {
    try {
        const cards = await t.cards('all');
        return cards.map(card => ({
            name: card.name,
            desc: card.desc.slice(0,1000),
            pos: card.pos,
            labels: card.labels.map(label => ({ name: label.name })),
            due: card.due,
            dateLastActivity: card.dateLastActivity,
            members: card.members.map(member => ({ fullName: member.fullName})),
            checklists: card.checklists ? card.checklists.map(checklist => ({
                name: checklist.name,
                itemCount: checklist.checkItems ? checklist.checkItems.length : 0,
                completedItemCount: checklist.checkItems ? checklist.checkItems.filter(item => item.state === 'complete').length : 0
            })) : []
            // Add more fields as needed, but avoid large data like attachments
        }));
    } catch (error) {
        console.error('Error fetching card data:', error);
        throw error;
    }
};