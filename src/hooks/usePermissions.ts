useState<Role | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserRole() {
      if (!user) {
        setRole(null);
        setPermissions([]);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;

        if (data) {
          setRole(data.role);
          setPermissions(data.permissions as Permission[]);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserRole();
  }, [user]);

  const can = (action: string, subject: string): boolean => {
    if (role === 'admin') return true;
    return permissions.some(
      (permission) =>
        permission.action === action && permission.subject === subject
    );
  };

  return {
    role,
    permissions,
    loading,
    can,
    isAdmin: role === 'admin',
    isManager: role === 'manager',
    isEditor: role === 'editor',
  };
}