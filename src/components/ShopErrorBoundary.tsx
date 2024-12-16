import React from 'react';

interface Props {
    children: React.ReactNode;
}

interface State {
    hasError: boolean;
}

class ShopErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Shop error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="text-center p-4">
                    <h2 className="text-xl font-bold mb-2">Что-то пошло не так</h2>
                    <p>Пожалуйста, обновите страницу или свяжитесь с нами</p>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ShopErrorBoundary;
