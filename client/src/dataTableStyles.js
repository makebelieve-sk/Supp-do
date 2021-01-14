// Стили для текстового поля
export const SearchFieldStyle = {
    height: `32px`,
    width: `200px`,
    borderRadius: `3px`,
    borderTopLeftRadius: `5px`,
    borderBottomLeftRadius: `5px`,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    border: `1px solid #e5e5e5`,
    padding: `0 32px 0 16px`,
};

// Стили для кнопки очистки текстового поля
export const ClearButtonStyle = {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: `5px`,
    borderBottomRightRadius: `5px`,
    height: `32px`,
    width: `32px`,
    textAlign: `center`,
    display: `flex`,
    alignItems: `center`,
    justifyContent: `center`,
};

// Стили для строк
export const conditionalRowStyles = [
    {
        when: () => true,
        style: {
            color: 'black',
            '&:hover': {
                cursor: 'pointer',
            },
        },
    }
];