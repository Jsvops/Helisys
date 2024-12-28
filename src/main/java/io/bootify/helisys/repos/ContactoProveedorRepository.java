package io.bootify.helisys.repos;

import io.bootify.helisys.domain.ContactoProveedor;
import io.bootify.helisys.domain.Proveedor;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ContactoProveedorRepository extends JpaRepository<ContactoProveedor, Integer> {

    ContactoProveedor findFirstByCpePve(Proveedor proveedor);

}
