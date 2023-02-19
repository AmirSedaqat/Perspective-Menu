import {
    Dimensions,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from "react-native";
import React, { useCallback } from "react";
import Animated, {
    Extrapolate,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

import {
    GestureHandlerRootView,
    GestureDetector,
    Gesture,
} from "react-native-gesture-handler";

import { Entypo } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const THRESHOLD = SCREEN_WIDTH / 3;

const App = () => {
    const translateX = useSharedValue(0);

    const previousX = useSharedValue(translateX.value);
    const gesture = Gesture.Pan()
        .onStart((context) => {
            context.x = translateX.value;
            previousX.value = context.x;
        })
        .onUpdate((e) => {
            translateX.value = e.translationX + previousX.value;
        })
        .onEnd(() => {
            if (translateX.value <= THRESHOLD) {
                translateX.value = withTiming(0);
            } else {
                translateX.value = withTiming(SCREEN_WIDTH / 2);
            }
        });
    const rStyle = useAnimatedStyle(() => {
        const rotate = interpolate(
            translateX.value,
            [0, SCREEN_WIDTH / 2],
            [0, 3],
            Extrapolate.CLAMP
        );
        const borderRadius = interpolate(
            translateX.value,
            [0, SCREEN_WIDTH / 2],
            [0, 20],
            Extrapolate.CLAMP
        );
        return {
            transform: [
                { perspective: 100 },
                { translateX: translateX.value },
                { rotateY: `-${rotate}deg` },
            ],
            borderRadius,
        };
    }, []);
    const onPress = useCallback(() => {
        if (translateX.value > 0) {
            translateX.value = withTiming(0);
        } else {
            translateX.value = withTiming(SCREEN_WIDTH / 2);
        }
    }, []);
    return (
        <GestureHandlerRootView style={styles.container}>
            <StatusBar />
            <GestureDetector gesture={gesture}>
                <Animated.View
                    style={[{ flex: 1, backgroundColor: "white" }, rStyle]}
                >
                    <Entypo
                        name="menu"
                        size={36}
                        color={BACKGROUND_COLOR}
                        style={{ margin: 15 }}
                        onPress={onPress}
                    />
                    <Text
                        style={{
                            alignSelf: "center",
                            fontSize: 28,
                        }}
                    >
                        Perspective Menu
                    </Text>
                    <Text style={{ alignSelf: "center", marginTop: 20 }}>
                        Swipe to Right and Click Menu Button
                    </Text>
                </Animated.View>
            </GestureDetector>
        </GestureHandlerRootView>
    );
};

export default App;

const BACKGROUND_COLOR = "#1e1e23";
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BACKGROUND_COLOR,
    },
});
