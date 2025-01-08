const types = {
    AREAS: 'AREAS',
    REMOVE_AREAS: 'REMOVE_AREAS'
};

export const actions = {
    areasList: (dispatch, areas) => {
        dispatch({
            type: types.AREAS,
            areas,
        });
    },
    removeAreasList: (dispatch, areas) => {
        dispatch({
            type: types.AREAS,
            areas,
        });
    },

};

const initialState = {
    areas: [],
};
export const reducer = (state = initialState, action) => {
    // console.log(action, "actionactionaction")
    const { type } = action;
    switch (type) {
        case types.AREAS: {
            return {
                areas: action.areas,
            };
        }
        case types.REMOVE_AREAS: {
            return initialState;
        }
        default: {
            return state;
        }
    }
};
