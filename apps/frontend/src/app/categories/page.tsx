import { ProtectedRoute } from "../../components/auth/protected-route";
import { Category } from "../../templates/category";

export default function Home() {
  return (
    <ProtectedRoute>
      <Category />
    </ProtectedRoute>
  )
}