export const getCardData = async (t) => {
    try {
        const cards = await t.cards('all');
        return cards.map(card => ({
            id: card.id,
            name: card.name,
            desc: card.desc,
            labels: card.labels,
            due: card.due,
            members: card.members,
            // Add more fields as needed, but avoid large data like attachments
        }));
    } catch (error) {
        console.error('Error fetching card data:', error);
        throw error;
    }
};