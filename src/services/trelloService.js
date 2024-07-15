export const getCardData = async (t) => {
    const cards = await t.cards('all');
    return cards.map(card => ({
        id: card.id,
        name: card.name,
        desc: card.desc,
        // Add more fields as needed, but avoid large data like attachments
    }));
};