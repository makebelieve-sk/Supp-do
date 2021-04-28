// Хук, возвращающий текущее значение ширины окна браузера
import {Grid} from "antd";

const {useBreakpoint} = Grid; // Извлекаем хук useBreakpoint из Grid Antd

export const useWindowWidth = () => {
    // Получаем текущий размер окна браузера
    const screens = useBreakpoint();

    const currentScreen = Object.entries(screens)
        .filter(screen => !!screen[1])
        .map(screen => screen[0]);

    // Определяем название класса
    return currentScreen[currentScreen.length - 1] === "xs"
        ? "xs" : currentScreen[currentScreen.length - 1] === "sm"
            ? "sm" : currentScreen[currentScreen.length - 1] === "md"
                ? "md" : currentScreen[currentScreen.length - 1] === "lg"
                    ? "lg" : currentScreen[currentScreen.length - 1] === "xl"
                        ? "xl" : "xxl";
}