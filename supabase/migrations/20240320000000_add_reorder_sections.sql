create or replace function reorder_form_sections(
    p_sections jsonb,
    p_form_id uuid
) returns void as $$
begin
    -- Validate that all sections belong to the form
    if exists (
        select 1
        from jsonb_array_elements(p_sections) as s
        left join operations_form_sections ofs on ofs.id = (s->>'id')::uuid
        where ofs.form_id != p_form_id
    ) then
        raise exception 'Invalid section IDs provided';
    end if;

    -- Update orders in a transaction
    update operations_form_sections ofs
    set 
        order = (s->>'order')::int,
        updated_at = now()
    from jsonb_array_elements(p_sections) s
    where ofs.id = (s->>'id')::uuid;
end;
$$ language plpgsql security definer; 