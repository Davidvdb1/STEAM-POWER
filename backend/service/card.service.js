import CardDb from '../domain/data-access/card.db.js';
import {Card} from '../domain/model/card.js';
import {ValidationError} from '../domain/model/validationError.js';
import {CustomException} from '../domain/model/customException.js';
import {ErrorEnum} from '../domain/model/errorEnum.js';


const fetchCards = async () => {
    return await CardDb.fetchCards();
};

const createCard = async (card, files) => {
    try {
        const validatedCard = new Card(card);
        return await CardDb.createCard(validatedCard, files);
    } catch (error) {
        if (error instanceof ValidationError) {
            throw new CustomException(ErrorEnum.ValidationFailed, error.errors);
        }
        throw error;
    }


}

const deleteCard = async (cardId) => {
    const card = await CardDb.fetchCard(cardId);
    if (!card) {
        throw new CustomException(ErrorEnum.DoesntExist, `Er bestaat geen card met id ${cardId}.`);
    }
    return await CardDb.deleteCard(cardId);
}

const fetchCard = async (cardId) => {
    return await CardDb.fetchCardById(cardId);
};

export default {
    fetchCards,
    createCard,
    deleteCard,
    fetchCard,
};