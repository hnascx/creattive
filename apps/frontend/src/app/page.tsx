import { ProtectedRoute } from "../components/auth/protected-route";
import { Homepage } from "../templates/homepage";

export default function Home() {
  return (
    <ProtectedRoute>
      <Homepage />
    </ProtectedRoute>
  )
}
