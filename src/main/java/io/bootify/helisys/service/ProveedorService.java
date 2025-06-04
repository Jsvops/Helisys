package io.bootify.helisys.service;

import io.bootify.helisys.domain.ContactoProveedor;
import io.bootify.helisys.domain.Producto;
import io.bootify.helisys.domain.Proveedor;
import io.bootify.helisys.model.ProveedorDTO;
import io.bootify.helisys.repos.ContactoProveedorRepository;
import io.bootify.helisys.repos.ProductoRepository;
import io.bootify.helisys.repos.ProveedorRepository;
import io.bootify.helisys.util.NotFoundException;
import io.bootify.helisys.util.ReferencedWarning;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class ProveedorService {

    private final ProveedorRepository proveedorRepository;
    private final ContactoProveedorRepository contactoProveedorRepository;
    private final ProductoRepository productoRepository;

    public ProveedorService(final ProveedorRepository proveedorRepository,
            final ContactoProveedorRepository contactoProveedorRepository,
            final ProductoRepository productoRepository) {
        this.proveedorRepository = proveedorRepository;
        this.contactoProveedorRepository = contactoProveedorRepository;
        this.productoRepository = productoRepository;
    }

    public List<ProveedorDTO> findAll() {
        final List<Proveedor> proveedores = proveedorRepository.findAll(Sort.by("pveId"));
        return proveedores.stream()
                .map(proveedor -> mapToDTO(proveedor, new ProveedorDTO()))
                .toList();
    }

    public ProveedorDTO get(final Integer pveId) {
        return proveedorRepository.findById(pveId)
                .map(proveedor -> mapToDTO(proveedor, new ProveedorDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Integer create(final ProveedorDTO proveedorDTO) {
        final Proveedor proveedor = new Proveedor();
        mapToEntity(proveedorDTO, proveedor);
        return proveedorRepository.save(proveedor).getPveId();
    }

    public void update(final Integer pveId, final ProveedorDTO proveedorDTO) {
        final Proveedor proveedor = proveedorRepository.findById(pveId)
                .orElseThrow(NotFoundException::new);
        mapToEntity(proveedorDTO, proveedor);
        proveedorRepository.save(proveedor);
    }

    public void delete(final Integer pveId) {
        proveedorRepository.deleteById(pveId);
    }

    private ProveedorDTO mapToDTO(final Proveedor proveedor, final ProveedorDTO proveedorDTO) {
        proveedorDTO.setPveId(proveedor.getPveId());
        proveedorDTO.setPveNombre(proveedor.getPveNombre());
        proveedorDTO.setPveTelefono(proveedor.getPveTelefono());
        proveedorDTO.setPveFax(proveedor.getPveFax());
        proveedorDTO.setPveEmail(proveedor.getPveEmail());
        proveedorDTO.setPveDireccion(proveedor.getPveDireccion());
        proveedorDTO.setPveCiudad(proveedor.getPveCiudad());
        proveedorDTO.setPvePais(proveedor.getPvePais());
        return proveedorDTO;
    }

    private Proveedor mapToEntity(final ProveedorDTO proveedorDTO, final Proveedor proveedor) {
        proveedor.setPveNombre(proveedorDTO.getPveNombre());
        proveedor.setPveTelefono(proveedorDTO.getPveTelefono());
        proveedor.setPveFax(proveedorDTO.getPveFax());
        proveedor.setPveEmail(proveedorDTO.getPveEmail());
        proveedor.setPveDireccion(proveedorDTO.getPveDireccion());
        proveedor.setPveCiudad(proveedorDTO.getPveCiudad());
        proveedor.setPvePais(proveedorDTO.getPvePais());
        return proveedor;
    }

    public ReferencedWarning getReferencedWarning(final Integer pveId) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final Proveedor proveedor = proveedorRepository.findById(pveId)
                .orElseThrow(NotFoundException::new);
        final ContactoProveedor cpePveContactoProveedor = contactoProveedorRepository.findFirstByCpePve(proveedor);
        if (cpePveContactoProveedor != null) {
            referencedWarning.setKey("proveedor.contactoProveedor.cpePve.referenced");
            referencedWarning.addParam(cpePveContactoProveedor.getCpeId());
            return referencedWarning;
        }
        final Producto proPveProducto = productoRepository.findFirstByProPve(proveedor);
        if (proPveProducto != null) {
            referencedWarning.setKey("proveedor.producto.proPve.referenced");
            referencedWarning.addParam(proPveProducto.getProId());
            return referencedWarning;
        }
        return null;
    }

    public Proveedor getByIdOrThrow(Integer id) {
        return proveedorRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Proveedor no encontrado"));
    }

}
