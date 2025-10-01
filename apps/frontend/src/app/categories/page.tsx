import { ProtectedRoute } from "../../components/auth/protected-route";
import { Category } from "../../templates/category";

export default function Categories() {
  return (
    <ProtectedRoute>
      <Category />
    </ProtectedRoute>
  )
}