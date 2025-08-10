// 📁 src/hooks/useUserRole.jsx
import { useContext } from 'react';
import { AuthContext } from '../context/AuthProvider';

const useUserRole = () => {
  const { role, roleLoading } = useContext(AuthContext);

  return {
    role,
    roleLoading,
    isAdmin: role === 'admin',
    isOrganizer: role === 'organizer',
    isVolunteer: role === 'volunteer',
  };
};

export default useUserRole;
