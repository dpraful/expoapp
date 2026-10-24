import React, { ErrorInfo, ReactNode } from 'react';
import { Button, StyleSheet, Text, View, Image } from 'react-native';
import { notifyMessage } from '../CommonStyle/ComponentFunctions';
import { normalize } from '../CommonStyle/ComponentFunctions';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    // console.log('componentDidCatch ', error, ' ', errorInfo);
    notifyMessage("ERROR : " + error + ' ' + errorInfo, 2)
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <View style={styles.container}>
          <View style={{ width: '100%', }}>
            <Image
              source={{ uri: "https://t4.ftcdn.net/jpg/05/24/04/51/360_F_524045110_UXnCx4GEDapddDi5tdlY96s4g0MxHRvt.jpg" }}
              resizeMode="cover" style={{ height: normalize(200) }} />
          </View>
          <Text style={styles.message}>
            Something went wrong.{'\n'} Our team has taken a note of this issue.
          </Text>
          {/* <Button 
            title="Try Again" 
            onPress={() => CodePush.restartApp()} 
          /> */}

        </View>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  message: {
    fontSize: normalize(16),
    color: 'black',
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
});