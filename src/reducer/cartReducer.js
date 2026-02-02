export const initialState = {
    items: [],
    totalItems: 0,
    totalPrice: 0,
};

export const cartReducer = (state, action) => {
    switch (action.type) {
        case "ADD_ITEM": {
            const { product, quantity = 1 } = action.payload;
            const existingItem = state.items.find((item) => item.id === product.id);

            let updatedItems;
            if (existingItem) {
                updatedItems = state.items.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                updatedItems = [
                    ...state.items,
                    {
                        id: product.id,
                        title: product.title,
                        price: product.price,
                        thumbnail: product.thumbnail,
                        brand: product.brand,
                        quantity: quantity,
                    },
                ];
            }

            const totalItems = updatedItems.reduce(
                (sum, item) => sum + item.quantity,
                0
            );
            const totalPrice = updatedItems.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            );

            return {
                ...state,
                items: updatedItems,
                totalItems,
                totalPrice: parseFloat(totalPrice.toFixed(2)),
            };
        }

        case "REMOVE_ITEM": {
            const { productId } = action.payload;
            const updatedItems = state.items.filter((item) => item.id !== productId);

            const totalItems = updatedItems.reduce(
                (sum, item) => sum + item.quantity,
                0
            );
            const totalPrice = updatedItems.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            );

            return {
                ...state,
                items: updatedItems,
                totalItems,
                totalPrice: parseFloat(totalPrice.toFixed(2)),
            };
        }

        case "UPDATE_QUANTITY": {
            const { productId, quantity } = action.payload;

            if (quantity <= 0) {
                return cartReducer(state, {
                    type: "REMOVE_ITEM",
                    payload: { productId },
                });
            }

            const updatedItems = state.items.map((item) =>
                item.id === productId ? { ...item, quantity } : item
            );

            const totalItems = updatedItems.reduce(
                (sum, item) => sum + item.quantity,
                0
            );
            const totalPrice = updatedItems.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            );

            return {
                ...state,
                items: updatedItems,
                totalItems,
                totalPrice: parseFloat(totalPrice.toFixed(2)),
            };
        }

        case "SET_CART": {
            const updatedItems = action.payload || [];
            const totalItems = updatedItems.reduce(
                (sum, item) => sum + item.quantity,
                0
            );
            const totalPrice = updatedItems.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            );

            return {
                ...state,
                items: updatedItems,
                totalItems,
                totalPrice: parseFloat(totalPrice.toFixed(2)),
            };
        }

        case "CLEAR_CART":
            return initialState;

        default:
            return state;
    }
};

