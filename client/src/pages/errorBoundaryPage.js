// Компонент предохранитель
import React, {Component} from "react";
import ErrorIndicator from "../components/content.components/errorIndicator/errorIndicator.component";

export default class ErrorBoundaryPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            error: null,
            errorText: null
        };
    }

    // Обновляем состояние при получении ошибки у компонент потомк (побочные действия запрещены)
    static getDerivedStateFromError(error) {
        return {error: error};
    }

    // Обработка возникшей ошибки (можно выполнять побочные действия)
    componentDidCatch(error, errorInfo) {
        // Можно залогинить ошибку в журнал ошибок
        console.log(error, errorInfo);
        this.setState({error, errorInfo});
    }

    render() {
        return this.state.error ? <ErrorIndicator errorText={this.state.errorText} /> : this.props.children;
    }
}