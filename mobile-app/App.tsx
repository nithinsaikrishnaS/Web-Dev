import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { StatusBar } from "expo-status-bar"
import { AuthProvider } from "./src/contexts/AuthContext"
import LoginScreen from "./src/screens/LoginScreen"
import DashboardScreen from "./src/screens/DashboardScreen"
import TaskListScreen from "./src/screens/TaskListScreen"
import AuditScreen from "./src/screens/AuditScreen"

const Stack = createStackNavigator()

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: "Auditor Dashboard" }} />
          <Stack.Screen name="TaskList" component={TaskListScreen} options={{ title: "Audit Tasks" }} />
          <Stack.Screen name="Audit" component={AuditScreen} options={{ title: "Complete Audit" }} />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </AuthProvider>
  )
}
