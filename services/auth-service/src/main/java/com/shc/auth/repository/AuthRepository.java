package com.shc.auth.repository;

import com.shc.auth.entity.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AuthRepository extends JpaRepository<AppUser, UUID> {

    Optional<AppUser> findByEmail(String email);

    boolean existsByEmail(String email);

    List<AppUser> findByRoleAndVerified(String role, boolean verified);

    List<AppUser> findByRole(String role);
}