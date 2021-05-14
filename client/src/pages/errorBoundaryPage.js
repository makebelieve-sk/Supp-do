// Страница ошибки
import React, {Component} from "react";
import ErrorIndicator from "../components/content.components/errorIndicator/errorIndicator.component";

export default class ErrorBoundaryPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            error: null,
            errorInfo: null
        };
    }

    // Обработка возникшей ошибки (можно выполнять побочные действия)
    componentDidCatch(error, errorInfo) {
        // Можно залогинить ошибку в журнал ошибок
        this.setState({error, errorInfo});
    }

    render() {
        return this.state.error
            ? <ErrorIndicator error={this.state.error + " " + this.state.errorInfo.componentStack} />
            : this.props.children;
    }
}