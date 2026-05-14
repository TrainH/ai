package com.project.backend.domain.user.repository;

import com.project.backend.domain.user.entity.UserAgreement;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserAgreementRepository extends JpaRepository<UserAgreement, Long> {
}
