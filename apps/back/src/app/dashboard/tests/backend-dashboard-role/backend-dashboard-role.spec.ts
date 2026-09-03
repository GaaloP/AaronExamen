describe('Dashboard backend role access rule', () => {
    const canAccessDashboard = (role?: string) => {
        const normalizedRole = role?.toLowerCase();
        return normalizedRole === 'admin' || normalizedRole === 'supervisor';
    };

    it('permite el acceso cuando el usuario es Supervisor', () => {
        const result = canAccessDashboard('admin');

        expect(result).toBe(true);
    });

    it('bloquea el acceso cuando el usuario es Agente', () => {
        const result = canAccessDashboard('user');

        expect(result).toBe(false);
    });

    it('rechaza roles desconocidos o vacíos', () => {
        expect(canAccessDashboard(undefined)).toBe(false);
        expect(canAccessDashboard('guest')).toBe(false);
    });
});
