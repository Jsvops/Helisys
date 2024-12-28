package io.bootify.helisys.repos;

import io.bootify.helisys.domain.AlmacenContenedor;
import io.bootify.helisys.domain.ModeloAeronave;
import io.bootify.helisys.domain.Producto;
import io.bootify.helisys.domain.Proveedor;
import io.bootify.helisys.domain.TipoProducto;
import io.bootify.helisys.model.ProductViewDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;


public interface ProductoRepository extends JpaRepository<Producto, Integer> {

    Producto findFirstByProTpo(TipoProducto tipoProducto);

    Producto findFirstByProAmc(AlmacenContenedor almacenContenedor);

    Producto findFirstByProMre(ModeloAeronave modeloAeronave);

    Producto findFirstByProPve(Proveedor proveedor);

    @Query("SELECT new io.bootify.helisys.model.ProductViewDTO( " +
        "p.proId, " +
        "p.proNumeroParte, " +
        "p.proNombre, " +
        "p.proNumeroParteAlterno, " +
        "p.proNumeroSerie, " +
        "p.proUnidades, " +
        "p.proFechaVencimiento, " +
        "p.proTipoDocumento, " +
        "tpo.tpoNombreTipo, " +
        "CONCAT(amt.amtDescripcion, amr.amrNombre, amc.amcNumero), " +
        "mre.mreNombre, " +
        "pve.pveNombre) " +
        "FROM Producto p " +
        "JOIN p.proTpo tpo " +
        "JOIN p.proAmc amc " +
        "JOIN amc.amcAmr amr " +
        "JOIN amr.amrAmt amt " +
        "JOIN p.proMre mre " +
        "JOIN p.proPve pve " +
        "WHERE (p.proNumeroParte = :partNumber) " +
        "   OR (p.proNombre = :name) " +
        "   OR (p.proNumeroParteAlterno = :alterPartNumber)")
    List<ProductViewDTO> findProducts(@Param("partNumber") String partNumber,
                                      @Param("name") String name,
                                      @Param("alterPartNumber") String alterPartNumber);


}


