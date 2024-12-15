import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route } from "react-router-dom";
import UserProfile from "./UserProfile";
import { getUserById } from "../../utils/api";

jest.mock('../../utils/api', () => ({
  getUserById: jest.fn(),
}));

describe('getUserById', () => {
  it('should return mocked user data', async () => {
    getUserById.mockResolvedValue({
      data: { name: 'Wojtek', bio: "Wojtek's bio", created_at: '2024-01-01' },
    });

    const result = await getUserById(1);
    expect(result).toEqual({
      data: { name: 'Wojtek', bio: "Wojtek's bio", created_at: '2024-01-01' },
    });
  });
});


describe('UserProfile', () => {

  it('should display UserProfile', async () => {
    getUserById.mockResolvedValue({
      data: { name: 'Wojtek', bio: "Wojtek's bio", created_at: '2024-01-01' },
    });

    const { container, debug } = await render(
      <MemoryRouter initialEntries={["/users/1"]}>
        <Route path="/users/:id" element={<UserProfile />} />
      </MemoryRouter>
    );

    const userNameElement = await screen.findByTestId('user-name');
    expect(userNameElement).toHaveTextContent('User: Wojtek');
  });

});

